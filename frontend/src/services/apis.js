
const BASE_URL = "http://localhost:4000/api/v1"


export const endpoints = {
    GENERATE_NONCE: BASE_URL+"/auth/generate-nonce",
    SIGN_UP: BASE_URL+"/auth/sign-up",
    LOG_IN: BASE_URL+"/auth/log-in",
    GET_DOCTORS: BASE_URL+"/auth/get-doctors",
    PROVIDE_ACCESS: BASE_URL + "/auth/provide-access",
    ACCESS_GRANTED: BASE_URL + "/auth/access-granted",
    REVOKE_ACCESS: BASE_URL + "/auth/revoke-access",
    PATIENT_ACCESS: BASE_URL + "/auth/get-patients",
}

export const ehrEndpoints = {
    UPLOAD_EHR: BASE_URL + "/ehr/ehr-upload"
}