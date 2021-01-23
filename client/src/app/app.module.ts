import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';

// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const cleanTypeName = new ApolloLink((operation, forward) => {
      if (operation.variables) {
        const omitTypename = (key, value) => {
          return key === '__typename' ? undefined : value;
        };
        // operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation).map((data) => {
        return data;
      });
    });

    const httpLinkWithErrorHandling = ApolloLink.from([
      cleanTypeName,
      httpLink.create({ uri: 'http://127.0.0.1/graphql'})
    ]);
    apollo.create({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache({
        addTypename: false
      })
    });
  }
}
