import { NextFunction, Request, Response } from "express";
import {
  jwtService,
  queryUserRepository,
} from "../../../../routes/composition-root";

export const authTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  const userId = await jwtService.getUserIdByJWTToken(accessToken);
  if (!userId) {
    res.sendStatus(401);
    return;
  }
  const foundedUser = await queryUserRepository.getUserByUserId(userId);
  if (!foundedUser) {
    res.sendStatus(401);
    return;
  }
  req.user = foundedUser;
  return next();
};

export const authTokenForGetRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next();
  } else {
    const accessToken = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByJWTToken(accessToken);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    const foundedUser = await queryUserRepository.getUserByUserId(userId);
    if (!foundedUser) {
      res.sendStatus(401);
      return;
    }
    req.user = foundedUser;
  }
  next();
};

// injectable();
// export class AuthTokenMiddleware {
//   constructor(
//     @inject(JwtService) protected JwtService: JwtService,
//     @inject(QueryUserRepository)
//     protected QueryUserRepository: QueryUserRepository
//   ) {}

//   async authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
//     if (!req.headers.authorization) {
//       res.sendStatus(401);
//       return;
//     }

//     const accessToken = req.headers.authorization.split(" ")[1];

//     const userId = await this.JwtService.getUserIdByJWTToken(accessToken);
//     if (!userId) {
//       res.sendStatus(401);
//       return;
//     }
//     const foundedUser: OutputUserType | null =
//       await this.QueryUserRepository.getUserById(userId);
//     if (!foundedUser) {
//       res.sendStatus(401);
//       return;
//     }
//     req.user = foundedUser;
//     return next();
//   }

//   async authTokenForGetRequets(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     if (!req.headers.authorization) {
//       return next();
//     } else {
//       const accessToken = req.headers.authorization.split(" ")[1];

//       const userId = await this.JwtService.getUserIdByJWTToken(accessToken);
//       if (!userId) {
//         res.sendStatus(401);
//         return;
//       }
//       const foundedUser: OutputUserType | null =
//         await this.QueryUserRepository.getUserById(userId);
//       if (!foundedUser) {
//         res.sendStatus(401);
//         return;
//       }
//       req.user = foundedUser;
//     }
//     next();
//   }
// }
