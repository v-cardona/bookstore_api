import { EntityRepository, Repository } from "typeorm";
import { PublicFile } from "./publicFile.entity";

@EntityRepository(PublicFile)
export class PublicFileRepository extends Repository<PublicFile> {

}