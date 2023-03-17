import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/auth/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res) {
    try {
      const accessToken = req.user.accessToken;
      const html_url = req.user.profile._json.html_url;
      const login = req.user.profile._json.login;
      console.log(accessToken, html_url, login);

      res.cookie('access_token', accessToken);
      res.cookie('github_username', login);
      res.cookie('html_url', html_url);

      res.redirect('http://127.0.0.1:5173/guestbook');
    } catch (error) {
      throw error;
    }
  }

  @Get('/logout')
  async logout(@Req() req, @Res() res) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('github_username');
      res.clearCookie('github_avatar');

      res.redirect('/');
    } catch (error) {
      throw error;
    }
  }
}
