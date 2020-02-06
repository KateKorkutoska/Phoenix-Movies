import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../../models/user';
import {FirebaseService} from '../firebase/firebase.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedUser: User;
    url = 'https://us-central1-movieapp-8d481.cloudfunctions.net/app/sendmail';

    constructor(public afAuth: AngularFireAuth, private fireService: FirebaseService, private http: HttpClient // Inject Firebase auth service
    ) {

    }

    sendMail(body) {
        return this.http.post(this.url, body);
    }

    getUser() {
        return this.loggedUser;
    }

    setUser(user) {
        this.loggedUser = user;
    }

    // Sign in with email/password
    SignIn(email, password) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((result) => {
                    resolve(result);
                }).catch((error) => {
                reject(error);
            });
        });
    }

    updateUser(email, password, newEmail) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function(userCredential) {
                resolve(userCredential.user.updateEmail(newEmail));
            });
        });

    }

    // Sign up with email/password
    SignUp(email, password, userForm) {
        return new Promise<boolean>((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    this.fireService.createUser(userForm).then(() => {
                        this.SignIn(email, password).then(() => {
                            resolve(true);
                        });
                    });
                }).catch((error) => {
                reject(error);
            });
        });
    }


    // Reset Forggot password
    ForgotPassword(passwordResetEmail) {
        return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            }).catch((error) => {
                window.alert(error);
            });
    }

}
