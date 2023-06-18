import { Navigate, createBrowserRouter, useSearchParams } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Editor from "./Editor";
import Auth from "./Auth";
import useUserStore from "./userStore";
import { useEffect } from "react";
import useEditorStore from "./editorStore";

const EditorRouter = () => {
  const userData = useUserStore((state) => state.userData);
  const [params, setParams] = useSearchParams()
  const setCurBufId = useEditorStore((state) => state.setCurBufId)
  const programParam = params.get('program')

  useEffect(() => {
    if (userData === 'signed out' || userData === undefined) return;
    let prog = programParam ?? userData.mostRecentProgram;
    if (programParam === null)
      setParams(`program=${prog}`)
    setCurBufId(prog)
  }, [programParam])

  if (userData === 'signed out' || userData === undefined) return <Navigate replace to="/login" />

  return <Editor />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate replace to="/editor" />
      </ProtectedRoute>
    ),
  },
  {
    path: "editor",
    element: (
      <EditorRouter />
    ),
  },
  {
    path: "login",
    element: (
      <ProtectedRoute access={false} fallback={<Navigate replace to="/editor" />} >
        <Auth />
      </ProtectedRoute>
    )
  },
]);

export default router;
