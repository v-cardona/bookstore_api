import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadString } from '@firebase/storage';
import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './publicFile.entity';
import { PublicFileRepository } from './publicFile.repository';

@Injectable()
export class FilesService {
    constructor(
      @InjectRepository(PublicFileRepository)
      private readonly _publicFilesRepository: PublicFileRepository,
    ) {
      
    }

    async getPublicFileUrl(fileReference: string): Promise<string> {
        
      const storage = getStorage();
      const storageRef = ref(storage, fileReference);

      try {
        return await getDownloadURL(storageRef);
      } catch (error) {
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      }

    }

    
    async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
        const storage = getStorage();
        const storageRef = ref(storage, filename);
        const metadata = {
            contentType: 'image/jpeg'
        };

        try {
          const uploadResult = await uploadBytes(storageRef, dataBuffer, metadata);
          const fullPath: string  = uploadResult.metadata.fullPath;
          // obtener la url del archivo
          const url: string = await this.getPublicFileUrl(fullPath);
          const newFile = this._publicFilesRepository.create({
            url: url,
            key: fullPath,
          });
          await this._publicFilesRepository.save(newFile);
          return newFile;
        } catch (error) {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
      
            // ...
      
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        }
    }

    

    async deletePublicFile(fileId: number): Promise<boolean> {
      const file = await this._publicFilesRepository.findOne({ id: fileId });
      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, file.key);

      // Delete the file
      try {
        deleteObject(desertRef);
        await this._publicFilesRepository.delete(fileId);
        return true;
      } catch (error) {
        
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      }
    }
}
