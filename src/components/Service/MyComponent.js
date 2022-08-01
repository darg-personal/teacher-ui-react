import {socket} from "service/socket";
// NOT HERE (1)
// socket.emit('HELLO_THERE');
function MyComponent () {

   // NOT HERE EITHER (2)
   // socket.emit('HELLO_THERE');
   const [connected, setConnected] = useState(false);
   // IT IS HERE
   useEffect(() => {
      socket.emit('HELLO_THERE');
      const eventHandler = () => setConnected(true);
      socket.on('WELCOME_FROM_SERVER', eventHandler);
      // unsubscribe from event for preventing memory leaks
      return () => {
         socket.off('WELCOME_FROM_SERVER', eventHandler);
      };
   }, []);
   return (
      <div>
          { connected ? (
               <p>Welcome from server!</p>
          ) : (
               <p>Not connected yet...</p>
          ) }
      </div>
   )
}
export default MyComponent