import { RegisterForm } from "../../data/UserData";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import type { DatePickerProps, FormProps } from "antd";
import { Notification } from "../../components/Notification";
import {
      AddressIcon,
      BirthdayIcon,
  EmailIcon,
  GenderIcon,
  PasswordIcon,
  UserIcon,
} from "../../components/MuiIIcon";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";
import publicApiService from "../../services/BaseApi";
import { PublicRoutes } from "../../router/PublicRoutes";
function SignUpForm() {
      const [form] = Form.useForm();
      const handleChangeGender = (value:boolean ):void=>{
            form.setFieldsValue({gender:value})
      }
      const handleChangeDate: DatePickerProps['onChange']=(_,dateString)=>{
            console.log(dateString);
            form.setFieldsValue({birth:dateString})
      }
      const navigate = useNavigate();
      const handleSubmit: FormProps<RegisterForm>["onFinish"] = async (values) => {
                  console.log(values);
            try {
                  await publicApiService.register(values);
                  Notification("success", "Register successful!"); //
                  navigate(PublicRoutes.LOGIN)
             } catch (error) {
                  console.log(error);
                  Notification(
                  "error",
                  "Login fail!",
                  "Please check your information again!"
            );
      }
  };

  const handleChangePage = (): void => {
    navigate(PublicRoutes.LOGIN);
  };

  return (
    <div className="bg-white/70 flex  justify-center items-center absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-80 h-fit sm:w-170 sm:h-fit rounded-4xl shadow-2xl">
      <Form
        name="Register"
        form={form}
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
        <div>
          <h1 className="text-[1.2rem] mt-5 mb-5 sm:text-3xl font-bold text-center">
            Register
          </h1>
        </div>
        <Form.Item<RegisterForm>
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

        <div className="flex justify-around">
          <Form.Item<RegisterForm>
            name="lastName"
            rules={[
              { required: true, message: "Please enter your last name!" },
            ]}
          >
            <Input placeholder="Lastname" style={{ height: "2.2rem" }} />
          </Form.Item>
          <FormItem<RegisterForm>
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name!" },
            ]}
          >
            <Input placeholder="Firstname" style={{ height: "2.2rem" }} />
          </FormItem>
        </div>

        <Form.Item<RegisterForm>
          name="password"
          rules={[{ required: true, message: "Please input your password!" },
                  { min:10, message:'Please enter at least 10 characters'},
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,message:'"Must include uppercase, lowercase, number, and special character!"'}
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary" style={{ height: "2.5rem" }}>
              <PasswordIcon />
            </Button>
            <Input.Password placeholder="password" />
          </Space.Compact>
        </Form.Item>

      
        <Form.Item<RegisterForm>
          name="email"
          rules={[{ required: true, message: "Please input your email!" }, {type:"email",message:'Please input vaild email!'}]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary" style={{ height: "2.5rem" }}>
              <EmailIcon />
            </Button>
            <Input placeholder="email" />
          </Space.Compact>
        </Form.Item>
        <div className=" sm:flex gap-3">
        <Form.Item<RegisterForm>
          name="gender"
          rules={[
            { required: true, message: "Please choose your gender!" },
          ]}
        >
          <Space.Compact>
            <Button type="primary">
              <GenderIcon />
            </Button>
            <Select
              placeholder='select gender'
              options={[
                { value: true, label: "Male" },
                { value: false, label: "Female" },
              ]}
              onChange={handleChangeGender}
            ></Select>
          </Space.Compact>
        </Form.Item>
        <Form.Item<RegisterForm>
          name="birth"
      //     rules={[{ required: true, message: "Please input your birthday!" }, {type:"date",message:'Please input vaild date!'}]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary">
              <BirthdayIcon />
            </Button>
              <DatePicker onChange={handleChangeDate}/>
          </Space.Compact>
        </Form.Item>
        </div>
        <Form.Item<RegisterForm>
          name="address"
          rules={[{ required: true, message: "Please enter your address!" },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Button type="primary" style={{ height: "2.5rem" }}>
              <AddressIcon />
            </Button>
            <Input placeholder="Address" />
          </Space.Compact>
        </Form.Item>

        <Form.Item className="h-10">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            style={{ padding: "1.2rem", borderRadius: "2rem" }}
          >
            Register
          </Button>
        </Form.Item>
        
        <FormItem>
          <p className="text-[0.7rem] sm:text-[1rem]">
            Are you already have account?
            <span
              className="text-blue-500 cursor-pointer font-bold hover:underline ml-1"
              onClick={handleChangePage}
            >
              Sign in
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

export default SignUpForm;
