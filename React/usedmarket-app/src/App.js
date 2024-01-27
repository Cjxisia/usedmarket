import React, { } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main_Component from './Component/Main_Component';
import RegisterComponent from './Component/Register_Component';
import Free_Board_Component from './Component/Free_Board_Component';
import Free_Board_Write_Component from './Component/Free_Board_Write_Component';
import Free_Board_Read_Component from './Component/Free_Board_Read_Component';
import Trading_Board_Component from './Component/Trading_Board_Component';
import Trading_Board_Write_Component from './Component/Trading_Board_Write_Component';
import Trading_Board_Read_Component from './Component/Trading_Board_Read_Component';
import Chat_Component from './Component/Chat_Component';
import ChatArchive_Component from './Component/ChatArchive_Component';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
      <div>
        <Routes>
          <Route path = "/" element = {<Main_Component />} />
          <Route path = "/register_page" element = {<RegisterComponent />} />
          <Route path = "/free_board_page" element = {<Free_Board_Component />} />
          <Route path = "/free_board_write_page" element = {<Free_Board_Write_Component />} />
          <Route path = "/free_board_page/:fb_id" element = {<Free_Board_Read_Component/>}/>
          <Route path = "/trading_board_page" element = {<Trading_Board_Component/>}/>
          <Route path = "/trading_board_write_page" element = {<Trading_Board_Write_Component/>} />
          <Route path = "/trading_board_page/:tb_id" element = {<Trading_Board_Read_Component/>}/>
          <Route path = "/chat" element = {<Chat_Component/>}/>
          <Route path = "/chatarchive" element = {<ChatArchive_Component/>}/>
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;