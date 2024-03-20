import axios, { AxiosResponse } from "axios";
import {IPlayerInfo, IPlayerToken} from '../types/types'
import { log } from "console";
const url =  process.env.REACT_APP_BASE_URL;


export const api = {

    async playerId (userData : IPlayerInfo):Promise<IPlayerToken>{
        try{
      
            const { data } = await axios.post<IPlayerInfo, AxiosResponse<IPlayerToken>>(`${url}/init`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            
            return data;
            
        }catch(error: any){
            throw error;

        }
        
    },
    async getToken(id:string):Promise<string>{
      
        try {
          
            const promises = [];
            for (let i = 1; i <= 4; i++) {
                promises.push(
                    axios.get(`${url}/token/${i}?id=${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                );
            }
            const responses = await Promise.all(promises);
            const tokenChunks = responses.map(response => response.data);
            const combinedToken = combineChunksInSequence(tokenChunks);
            return combinedToken;
        } catch (error:any) {

            
            throw error;
        }
    }

}

function combineChunksInSequence(data: { no: number; chunk: string }[]): string {
    const sortedData = data.sort((a, b) => a.no - b.no);
    
    let token = '';
    for (const item of sortedData) {
        token += item.chunk;
    }
    return token;
}