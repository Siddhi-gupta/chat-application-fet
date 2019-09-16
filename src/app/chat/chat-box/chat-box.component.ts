import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from './chat';
import { UserDetailsComponent } from '../../shared/user-details/user-details.component';
import { FirstCharComponent } from '../../shared/first-char/first-char.component';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService] // made local instance of this service not global
})
export class ChatBoxComponent implements OnInit {

  @ViewChild('scrollMe', {static: false})

  public scrollMe: ElementRef;
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public messageText: any;
  public messageList: any = [];
  public scrollToChatTop: boolean = false;
  public previouChatList: any = [];
  public pageValue: number =  0;
  public loadingPreviousChat: boolean = false;

  constructor(private socketService: SocketService, 
    private appService: AppService, 
    private router: Router, 
    private toastr: ToastrService) { 
      this.receiverId = Cookie.get('receiverId');
      this.receiverName = Cookie.get('receiverName');
    }

  ngOnInit() {

    this.authToken = Cookie.get('authtoken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    console.log(this.receiverId, this.receiverName);
    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!= "") {
      this.userSelectedToChat(this.receiverId,this.receiverName);
    }
    //this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromUser();
  }

  // public checkStatus: any = () => {
  //   if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
  //     this.router.navigate(['/']);
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
    .subscribe((data) => {
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
      this.getOnlineUserList();
    });
  }

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList()
    .subscribe((userList) => {
      this.userList = [];
      for (let x in userList) {
        let temp = {'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false};
        this.userList.push(temp);
      }
      console.log(this.userList);
    });
  }

  public sendMessageUsingKeyPress: any = (event: any) => {
    if (event.keyCode === 13) { //13 is keycode of enter.
      this.sendMessage();
    }
  } // end of sendMessageUsingKeyPress.

  public sendMessage: any = () => {

    if (this.messageText) {
      let chatMsgObject: ChatMessage = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('recieverId'),
        message: this.messageText,
        createdOn: new Date()
      }
      console.log(chatMsgObject);
      this.socketService.sendChatMessage(chatMsgObject);
      this.pushToChatWindow(chatMsgObject);
    } else {
      this.toastr.warning('text message can not be empty', 'warning');
    }
  } // sendMessage end

  public pushToChatWindow: any = (data) => {
    this.messageText = "";
    this.messageList.push(data);
    this.scrollToChatTop = false;
  } // end pushToChatWindow

  public getMessageFromUser: any = () => {
    this.socketService.chatByUserId(this.userInfo.userId)
    .subscribe((data) => {
      (this.receiverId == data.senderId) ? this.messageList.push(data) : '';
      this.toastr.success(`${data.senderName} says : ${data.message}`);
      this.scrollToChatTop = false;
    }); //end subscriber
  } // end getMessageFromUser

  public userSelectedToChat: any = (id, name) => {
    debugger;
    console.log("setting user as active");

    this.userList.map((user)=> {
      if(user.id == id) {
        user.chatting = true;
      } else {
        user.chatting = false;
      }
    });

    Cookie.set('receiverId', id);
    Cookie.set('receiverName', name);

    this.receiverId = id;
    this.receiverName = name;
    this.messageList = [];
    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }
    this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithAUser();
  } // end userSelectedToChat

  public getPreviousChatWithAUser: any = () => {
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);

    this.socketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {
      if (apiResponse == 200) {
        this.messageList = apiResponse.data.concat(previousData);
      } else {
        this.messageList = previousData;
        this.toastr.warning('No messages available', 'warning');
      }
      this.loadingPreviousChat = false;
    }, (err) => {
      this.toastr.error('Some error Occured', 'error')
      
    });
  } // end getPreviousChatWithAUser

  public loadEarlierPageOfChat: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithAUser()
  } // end loadEarlierPageOfChat

  public logout: any = () => {
    this.appService.logout()
    .subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        console.log("logout called")
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        Cookie.delete('authtoken');
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      } else {
        this.toastr.error(apiResponse.message, 'error');
      }
    }, (err) => {
      this.toastr.error('Some error occured', 'error');
    });
  }

  public showUserName =(name:string)=> {
    this.toastr.success("You are chatting with "+ name, "success");
  }
}
