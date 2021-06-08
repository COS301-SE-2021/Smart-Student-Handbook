import { Application } from "express";
import { create} from "./controller";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

export function routesConfig(app: Application) {
    app.post('/users',
        create
    );
}