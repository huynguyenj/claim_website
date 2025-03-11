import { UserForm} from "../../../model/UserData";
import { Button, Form, Input, Space } from "antd";
import { PasswordIcon, UserIcon } from "../../../components/Icon/MuiIIcon";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";
import {  PublicRoutes } from "../../../consts/RoutesConst";
import LoadingSpin from "../../../components/common/LoadingSpin";

import useLogin from "../../../hooks/auth/useLogin";
function LoginForm() {
  const navigate = useNavigate();
  const {handleSubmitLogin, loading} = useLogin();

  const handleChangePage = (): void => {
    navigate(PublicRoutes.FORGOTPASS);
  };

  return (
    <div className="bg-white-fig flex  justify-center items-center absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-70 h-fit sm:w-170 rounded-4xl shadow-fig ring-2 hover:shadow-fig-active duration-300 ease-in-out ">
      <Form
        name="Login"
        wrapperCol={{ span: 30 }}
        style={{ maxWidth: 500 }}
        onFinish={handleSubmitLogin}
        autoComplete="off"
        className="w-50 sm:w-100"
      >
        <div className=" sm:w-15 sm:h-15 sm:top-5 sm:left-5 bg-amber-200 rounded-full absolute">
          <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] animate-spinAround">
            <div className="sm:w-1 sm:h-10 bg-white/70 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]"></div>
            <div className="sm:w-10 sm:h-1 bg-white/70 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]"></div>
          </div>
        </div>
        <FormItem>
          <h1 className="text-[1.5rem] mt-5 sm:text-3xl font-bold text-center">
            Login
          </h1>
        </FormItem>
        <Form.Item<UserForm>
          name="email"
          rules={[{ required: true, message: "Please input your email!",type:"email" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button style={{ height: "2.5rem",background:'black' }}>
              <UserIcon sx={{color:'white'}} />
            </Button>
            <Input placeholder="email" />
          </Space.Compact>
        </Form.Item>

        <Form.Item<UserForm>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button style={{ height: "2.5rem",background:'black' }}>
              <PasswordIcon sx={{color:'white'}} />
            </Button>
            <Input.Password placeholder="password" />
          </Space.Compact>
        </Form.Item>

        <Form.Item className="h-10">
          <Button
            htmlType="submit"
            className="w-full"
            style={{ padding: "1.2rem", borderRadius: "2rem",fontSize:15,border:'2px solid',background:'black',color:'white' }}
          >
            {loading ? <LoadingSpin width="1rem" height="1rem" border_color="white" border_top_clr="black"/> : 'Login'}
          </Button>
        </Form.Item>
        <FormItem>
          <p className="text-[0.7rem] sm:text-[1rem]">
            You forget your password?
            <span
              className="text-blue-500 cursor-pointer font-bold hover:underline ml-1"
              onClick={handleChangePage}
            >
              Forget
            </span>
          </p>
        </FormItem>
        <div className=" sm:w-15 sm:h-15 sm:bottom-5 sm:right-5 bg-green-300 absolute rounded-full">
          <div className="rotate-45 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] animate-spinAround">
            <div className="sm:w-1 sm:h-10 bg-white/70 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]"></div>
            <div className="sm:w-10 sm:h-1 bg-white/70  absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]"></div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm;
