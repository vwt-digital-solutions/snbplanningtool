import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'token_url_encode' })
export class TokenURLPipe implements PipeTransform {
  transform(token: string): string {

    return token.replace(/\//g, '-');
  }
}
