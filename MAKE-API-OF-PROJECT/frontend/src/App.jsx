import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Singup from './component/Singup'
import Login from './component/Login'
import Todo from './component/Todo';


function App() {



  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
            <Singup/>
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <> 
          <Login/>
        </>
      ),
    },
    {
      path: "/todo",
      element: (
        <>         
             <Todo/>
        </>
      ),
    },
   
   
   
   
  ]);

  return (
    <>
       
      <RouterProvider router={router} />
     
    </>
  )
}

export default App
