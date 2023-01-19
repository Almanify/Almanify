//source https://ionicframework.com/docs/angular/your-first-app/taking-photos
//source https://ionicframework.com/docs/angular/your-first-app/saving-photos
import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  downloadURL: Observable<string>;

  constructor(public firestorage: AngularFireStorage) {
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    await this.savePic(capturedPhoto);
    return capturedPhoto;
  }

  uploadPicFromEvent(event, folderId: string): Promise<Observable<string>> {
    const file = event.target.files[0];
    const filePath = folderId + '/';

    const fileRef = this.firestorage.ref(filePath + event.target.files[0].name);
    const task = this.firestorage.upload(filePath + event.target.files[0].name, file);

    return new Promise<Observable<string>>((resolve) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          resolve(this.downloadURL);
        })
      ).subscribe();
    });
  }

  uploadPicFromPhoto(photo: Photo, folderId: string): Promise<Observable<string>> {
    console.log(photo);
    const filePath = folderId + '/';

    // get image from webpath
    const fileRef = this.firestorage.ref(filePath + photo.webPath);
    const task = this.firestorage.upload(filePath + photo.webPath, photo.webPath);

    return new Promise<Observable<string>>((resolve) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          resolve(this.downloadURL);
        })
      ).subscribe();
    });
  }

  deletePic(downloadURL: string) {
    const fileRef = this.firestorage.refFromURL(downloadURL);
    fileRef.delete();
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
    const response = await fetch(photo.webPath);
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
