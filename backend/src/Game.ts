import WebSocket from "ws";
import { INIT_GAME, MOVE, READ_BOARD } from "./commands";
import { Chess } from "./Chess";

export class Game{
    private games:Chess[];
    private users:WebSocket[]
    private pendingUser:WebSocket|null    
    private userBoards:Map<WebSocket,string[]>
    constructor(){
        this.games=[];
        this.pendingUser=null;
        this.users=[]
        this.userBoards=new Map()
    }    
    addUser(user: WebSocket){
        this.users.push(user)
        this.addHandler(user)
    }
    removeUser(user: WebSocket){
        this.users=this.users.filter((u)=>u!==user)
    }
    private addHandler(ws: WebSocket){
        ws.on('message',(data)=>{
            const msg=JSON.parse(data.toString())
            if(msg.type===INIT_GAME){
                this.userBoards.set(ws,msg.arrangement)
                if (this.pendingUser !== null && this.userBoards.has(this.pendingUser)) {
                    const chess = new Chess(this.pendingUser, ws);
                    this.games.push(chess);
                    const player1Setup = this.userBoards.get(this.pendingUser)!;
                    const player2Setup = msg.arrangement;
                    chess.arrangePieces("A", player1Setup);
                    chess.arrangePieces("B", player2Setup);

                    this.userBoards.delete(this.pendingUser);
                    this.userBoards.delete(ws);
                    this.pendingUser.send(JSON.stringify({ type:INIT_GAME,board:chess.board,player:"A" }));
                    ws.send(JSON.stringify({ type: INIT_GAME ,board:chess.board,player:"B"}));
                    this.pendingUser = null;
                }else{
                    this.pendingUser=ws
                }
            }
            if (msg.type === READ_BOARD) {
                const game = this.games.find(game => game.user1 === ws || game.user2 === ws);
                console.log("Game board sent to client:", game?.board); 
                if (game) {
                    ws.send(JSON.stringify({ type: READ_BOARD, board: game.board }));
                }
            }
            if(msg.type===MOVE){
                const game=this.games.find((game)=>game.user1===ws || game.user2===ws);
                if(game){
                    const [piece,move]=msg.move.split(':')
                    const player = (ws === game.user1) ? "A" : "B";
                    const piecePosition=game.getPiecePosition(piece,player)                    
                    if(piece.startsWith('P')){
                        game.handlePawn(piecePosition,move,player)
                    }
                    else if(piece==="H1"){
                        game.handleHero1(piecePosition,move,player)
                    }
                    else if(piece==="H2"){
                        game.handleHero2(piecePosition,move,player)
                    }
                }
            }
        })
    }
}