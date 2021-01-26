import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// used to create fake backend
import { fakeBackendProvider } from './helpers/fake-backend';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptors';

// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

//services
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './containers/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AlertComponent } from './components/alert/alert.component';
import { LandingComponent } from './containers/home/landing/landing.component';
import { MainNavComponent } from './components/navigation/mainNav/mainNav.component';



@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    AppComponent,
    HomeComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    MainNavComponent,
  ],
  imports: [
    BrowserModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {

    const cleanTypeName = new ApolloLink((operation, forward) => {
      if (operation.variables) {
        const omitTypename = (key, value) => {
          return key === '__typename' ? undefined : value;
        };
      }

      return forward(operation).map((data) => {
        return data;
      });
    });

    const httpLinkWithErrorHandling = ApolloLink.from([
      cleanTypeName,
      httpLink.create({ uri: `${environment.apiUrl}`})
    ]);
    apollo.create({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache({
        addTypename: false
      })
    });
  }
}
