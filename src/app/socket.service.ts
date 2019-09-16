import { Injectable } from '@angular/core';
import * as io  from 'socket.io-client';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = "https://chatapi.edwisor.com";
  private socket;

  constructor(public http: HttpClient) {
    // connection is being created
    // handshake with server
    this.socket = io(this.url);
   }

   //events to be listened

   public verifyUser = () => {
     return Observable.create((observer) => {
       this.socket.on('verifyUser', (data) => {
         observer.next(data);
       }); // end socket
     }); //end observable
   } // end vrify user

   public onlineUserList = () => {
     return Observable.create((observer) => {
      this.socket.on('online-user-list',(userList) => {
        observer.next(userList);
      }); // end socket
    }); // end observable
   } // end onlineUserList

   public disconnectedSocket = () => {
     return Observable.create((observer) => {
       this.socket.on('disconnect', () => {
         observer.next();
       });
     });
   }

   public chatByUserId = (userId) => {
     return Observable.create((observer) => {
       this.socket.on(userId, (data) => {
         observer.next(data);
       });
     });
   }

   public setUser = (authToken) => {
     this.socket.emit("set-user", authToken);
   }

   public sendChatMessage = (chatMsgObject) => {
     this.socket.emit("chat-msg", chatMsgObject);
   }

   public markChatAsSeen = (userInfo) => {
     this.socket.emit("mark-chat-as-seen", userInfo);
   }

   public getChat(senderId, receiverId, skip): Observable<any> {
     return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
     .pipe(tap(data => console.log('dataReceived')), catchError(this.handleError));
   } // end getchat

   public handleError(err: HttpErrorResponse) {
     let errorMessage = '';
     if (err.error instanceof Error) {
       errorMessage = `An error occure ${err.error.message}`;
     } else {
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.message}`;
     }
     console.error(errorMessage);

     return Observable.throw(errorMessage);
   }

   public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket
}
