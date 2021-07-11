/* eslint-disable no-console */
import { HTTPClient } from "./http.service";

export const authService = {
    async login(data) {
        const constVariable = {
            device: "controllerApp",
            deviceId: new Date().toString(),
            build: "1.0.0",
        };
        try {
            const {
                data: { data: userData },
            } = await HTTPClient.post("/auth/mallTeam", {
                ...data,
                ...constVariable,
            });
            console.log(userData);
            return userData;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async forgotPass_sendEmail(email) {
        try {
            const response = await HTTPClient.post("/auth/forgotPassword", {
                email,
            });
            return response;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async ResetPassword(payload) {
        try {
            const response = await HTTPClient.post("/auth/resetPassword", {
                ...payload,
            });
            return response;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async registerUser(payload) {
        try {
            const response = await HTTPClient.post("/auth/verifyUser", {
                ...payload,
            });
            return response;
        } catch (e) {
            return Promise.reject(e);
        }
    },
};
