import { UserForm } from "../../model/UserData";
import { Button, Form, Input, Space } from "antd";
import type { FormProps } from "antd";
import { Notification } from "../../components/Notification";
import { PasswordIcon, UserIcon } from "../../components/Icon/MuiIIcon";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
// import publicApiService from "../../services/BaseApi";
import { PublicRoutes } from "../../consts/RoutesConst";
import userCheck from '../../logindata.json'
function LoginForm() {
  const navigate = useNavigate();
  const addAuthInfo = useAuthStore((state) => state.setAuth);

  const handleSubmit: FormProps<UserForm>["onFinish"] = async (values) => {
    console.log(values)
    try {
      // const response = await publicApiService.login(values);
      // addAuthInfo(response.token, response.role);
      const user = userCheck.find((u)=> u.userName == values.userName && u.password == values.password)
      if(user){
        Notification("success", "Login successful!");
        navigate(PublicRoutes.HOME);
        addAuthInfo(user.token,user.role);
      }
    } catch (error) {
      console.log(error);
      Notification(
        "error",
        "Login fail!",
        "Please check your password or username!"
      );
    }
  };

  const handleChangePage = (): void => {
    navigate(PublicRoutes.REGISTER);
  };

  return (
    <div className="bg-white/70 flex  justify-center items-center absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-70 h-fit sm:w-170  rounded-4xl shadow-2xl">
      <Form
        name="Login"
        wrapperCol={{ span: 30 }}
        style={{ maxWidth: 500 }}
        onFinish={handleSubmit}
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
          <h1 className="text-[1.2rem] mt-5 sm:text-3xl font-bold text-center">
            Login
          </h1>
        </FormItem>
        <Form.Item<UserForm>
          name="userName"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary" style={{ height: "2.5rem" }}>
              <UserIcon />
            </Button>
            <Input placeholder="username" />
          </Space.Compact>
        </Form.Item>

        <Form.Item<UserForm>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary" style={{ height: "2.5rem" }}>
              <PasswordIcon />
            </Button>
            <Input.Password placeholder="password" />
          </Space.Compact>
        </Form.Item>

        <Form.Item className="h-10">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            style={{ padding: "1.2rem", borderRadius: "2rem" }}
          >
            Login
          </Button>
        </Form.Item>
        <FormItem>
          <p className="text-[0.7rem] sm:text-[1rem]">
            You not have an account?
            <span
              className="text-blue-500 cursor-pointer font-bold hover:underline ml-1"
              onClick={handleChangePage}
            >
              Sign up
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
