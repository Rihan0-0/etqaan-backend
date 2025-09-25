import { InjectModel } from "@nestjs/mongoose";
import { Batch } from "../schemas/batch.schema";
import { BatchMembership, MemberRole } from "../schemas/batch-membership.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { CreateBatchDto } from "../dto/create-batch.dto";

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<Batch>,
    @InjectModel(BatchMembership.name) private membershipModel: Model<BatchMembership>,
  ) { }

  async addMembers(batchId: string, members: { memberId: string, role: MemberRole }[]) {
    const memberships = members.map(member => new this.membershipModel({ ...member, batchId, joinedAt: new Date() }));
    return this.membershipModel.insertMany(memberships);
  }

  async removeMember(batchId: string, memberId: string) {
    return this.membershipModel.findOneAndDelete({ batchId, memberId }).exec();
  }

  async getMembers(batchId: string) {
    return this.membershipModel.find({ batchId }).exec();
  }

  private prepareMembers(teachers: string[], students: string[]) {
    const addRole = (ids: string[], role: MemberRole) =>
      ids.map(id => ({ memberId: id, role }));

    return [...addRole(students, MemberRole.STUDENT), ...addRole(teachers, MemberRole.TEACHER)];
  }


  async createBatch(createBatchDto: CreateBatchDto) {
    const { name, description, rankingWeights, teachersIds, studentsIds } = createBatchDto;

    const savedBatch = await this.batchModel.create({ name, description, rankingWeights });

    const members = this.prepareMembers(teachersIds, studentsIds);

    await this.addMembers(savedBatch._id as string, members);

    return savedBatch;
  }
}
