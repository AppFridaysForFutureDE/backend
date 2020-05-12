import * as webhook from "webhook-discord";

export class DiscordAccess {
  private static instance: DiscordAccess;
  private hook: webhook.Webhook;
  private username: string;
  private avatarUrl: string;

  private constructor() {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      throw "Warning: Env file is missing Discord Webhook URL";
    }
    this.hook = new webhook.Webhook(process.env.DISCORD_WEBHOOK_URL);
    this.username = "";
    this.avatarUrl = "";
  }

  public static getInstance(): DiscordAccess {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DiscordAccess();
    return this.instance;
  }

  public sendMessage(title: string, color: string, text: string) {
    const msg = new webhook.MessageBuilder();
    msg
      .setName(this.username)
      .setColor(color)
      .setTitle(title)
      .setAvatar(this.avatarUrl)
      .setText(text);
    this.hook.send(msg);
  }

  public setUser(name: string, avatarUrl: string) {
    this.username = name;
    this.avatarUrl = avatarUrl;
  }
}
