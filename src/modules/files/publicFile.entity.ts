import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files_public')
export class PublicFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  /**
   * url to download the file
   */
  public url: string;

  @Column()
  /**
   * FullPath reference of storage of the file
   */
  public key: string;
}
