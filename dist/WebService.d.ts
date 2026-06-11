declare class WebService {
    statusCode: any;
    result: any;
    response: any;
    constructor();
    invoke(params: any, options: any, postData?: any): Promise<any>;
    upload(fileName: any, path: any, path2: any, options: any): Promise<any>;
}
export { WebService };
