import { IInstanceData, IItemData , IDefinitionData} from './DataObjects';


export interface IBPMNClient  {
    engine: IClientEngine;
    datastore: IClientDatastore;
    definitions: IClientDefinitions;
}

export interface IClientEngine {
     start(name, data , startNodeId ,  userId,options ): Promise<IInstanceData>;
     invoke(query, data, userId): Promise<IInstanceData> ;
     assign(query, data, userId,assignment): Promise<IInstanceData>;
     throwMessage(messageId, data, messageMatchingKey);
     throwSignal(signalId, data, messageMatchingKey);
     status();
}
export interface IClientDatastore {
     findItems(query): Promise<IItemData[]>; 
     findInstances(query): Promise<IInstanceData[]>;
     deleteInstances(query);
}
export interface IClientDefinitions {
     import(name, pathToBPMN,pathToSVG);
     list(): Promise<string[]>;
     delete(name) ;
     rename(name,newName);
     load(name): Promise<IDefinitionData>;
}
