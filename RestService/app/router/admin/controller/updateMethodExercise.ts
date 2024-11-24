import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";
import { MethodExercises } from "../../../database/MethodExercises";

export function updateMethodExercise() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const method: Partial<MethodExercises> = req.body.method
    delete method.createTime
    await MethodExercises.update<MethodExercises>(method , [{key: 'id' , value: method.id}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '创建成功'))
  }
}