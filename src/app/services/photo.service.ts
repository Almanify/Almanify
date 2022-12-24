//source https://ionicframework.com/docs/angular/your-first-app/taking-photos
//source https://ionicframework.com/docs/angular/your-first-app/saving-photos
import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';
import {Preferences} from '@capacitor/preferences';
import {save} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() {
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    await this.savePic(capturedPhoto);
  }

  private async savePic(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    //TODO erweitern um speichern in cloud
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
