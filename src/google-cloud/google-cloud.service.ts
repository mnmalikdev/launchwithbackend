import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private readonly drive: any;

  constructor() {
    const credentials = {
      type: 'service_account',
      project_id: 'launchwithofficial',
      private_key_id: 'eb9f4a904b68f9647240c7da0680ad242cf25bff',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCTfkL2yBjcisrf\nAHLRewHFHS5e/rx4rozsx6ZEFfzc6u0hOZCpkNiDAzxk6e7xhS/rp2KRrs50iPft\nDRQYf54PH3PKIJo6lOMa1B3By/cA0ZjHhlg+MLgPCkTrmaER22lwrtNXgaX5GcHJ\nMvb4lhUs7WPCm2hc2oBe8/RXLGNc2DAiAoCvhWqd+IVj3HnIbZY3FNdbBEHy/oh/\n+MlMpJtcd3LQu7PbwSpxNVRuu9sQog9jjPbACE78xVcKt6wjABvvuqR8NVXG7Tez\n2YwHK8SLOh1wNeJAg4Ka6ZmvO9H3LM9uoKFtw/bNJbHBBvaUrGRqv6HFvBLIWOeF\n5ARQAR1LAgMBAAECggEALMsiTC99+XC/ZxWMSVlpsrMHk7sagy5Dx19k+/WPi4pf\nhQEmEZFXaAaSD3XKZxhTcuatdWAY/GRio2Ae88fCOYaMVF0tadAw3sN/3Az1UY7W\nLvZ6kzyZkZvFTaYlODaiIaI+tis+PFZZt6CeR+XQvYnFC+PFwLltVikR0m29KYNa\njTYnXcFZkmmwBs/NLbA6T0aZ2JAEWpt69wDJhYGD6uHnOYvH2xWkJ5cIUYlF/xSn\nYkd20revHU5cZQKXAEJv+WngXOaPNr5U7yMCh8z6uz9r14fShGrzJTYZCkC3bBP5\n9lVFpEk0RTo39EGDnPjGFGdZ6/kTyK2P/WuL2bv8ZQKBgQDKntQpL4S+ege1thT5\n5UjQt++h/03yGBVgRC5uHUhIrz2rLm4OUT0YaUuqp67cyXJt+oN8zoqS2wNGkFlL\nNJmduRhW/PjHybNUnWxMT7PYZUx3RbWX+chJTBrbGY37LQat6E7BWvVH9YUEKaFE\n8tYtc9TcH2spavqBm4clomzzhQKBgQC6WYfxv9qBqPnd7hQ1gZEbzrYQ2OGMf4WD\njEcpscgM1J/e/FgV4UoxzBbCPYP8d2XGGABmnaFkA5clxDDO518+A60q6EnVT9Nf\nySIHh/zvXf+dwT4LIiOjIoHt1DYKH/CwRtYLz2Y3c3vaB7cwh4kKq/bdWavKpZdX\nvDuHJEWejwKBgGOgdPFLTBncJq5SOT4mXwdBabJdthWzgc8ztyCthT037TqeOb8Q\nctnt7CadDH3DD2DELKLRa5GJ3rJzh3RTCLVkrXMYL7sMkgCo5vceuW9NX6vFuuRf\nDPv9T7creYRnP0GDWDX6Y2BeeGjzjzg3rtfqfF8/k5Fp6IKR1oHKu4eBAoGAI4aa\nAh5/O6TJLeQLej/fOBvqXb/bD/vnqjJ+Bpbb+oY2jD4zVMiEaoXr+M/db64beu5s\ndSOr9vMwR4TlgSxe3eW5h6qNGNuFAofHswPb1o5nAt4qQ9kYTitv9bU1MCzyp8h5\nWfsKE5wyilhaNihAmgY6o+xKcfGrrpA2EQd7NkUCgYAYwcmo8/r6WGoTu9fXe8mD\ndkgJ0YRITcc39FrNtr6jaeE1ZMFG5G1tHeXxihCbw3YYf/y8/+0pu/fq9sBfTEug\n/rTB/TkcQyNCrl3IPadIkEpT+ihKVLDxhbtnSSMxM5vdh9f70hObILnXRtTKbNwV\nOKpAZeFWNHxMqMt/0HksIA==\n-----END PRIVATE KEY-----\n',
      client_email:
        'launchwithofficial@launchwithofficial.iam.gserviceaccount.com',
      client_id: '113405638554085135288',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/launchwithofficial%40launchwithofficial.iam.gserviceaccount.com',
    };
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    this.drive = google.drive({
      version: 'v3',
      auth,
    });
  }

  async uploadFile(file: any, folderId: string): Promise<any> {
    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
      };
      const media = {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      };
      const res = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id,webContentLink',
      });
      return res.data.webContentLink;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
