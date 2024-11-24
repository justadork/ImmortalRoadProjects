import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";

export function deleteMapById() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const conditions: ConditionData<Map>[] = []
    req.body.idList.forEach((id: number) => {
      conditions.push({key: 'id' , value: id})
      conditions.push('or')
    })
    conditions.pop()
    await Map.delete<Map>(conditions)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '删除成功'))
  }
}