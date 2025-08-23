declare module "howler" {
  export class Howl {
    constructor(options: {
      src: string[];
      volume?: number;
      [key: string]: any;
    });

    play(): void;
    stop(): void;
    pause(): void;
    volume(volume?: number): number | this;
    on(event: string, callback: Function): this;
    off(event: string, callback?: Function): this;
  }
}
