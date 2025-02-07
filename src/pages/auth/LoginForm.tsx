import {UserForm} from '../../data/User'
import { Button, Form, Input } from 'antd'
import type { FormProps } from 'antd';
import apiService from '../../services/ApiService';
import { Notification } from '../../components/Notification';
function LoginForm() {
      const handleSubmit:FormProps<UserForm>['onFinish'] = async (values)=>{
            try {
                  await apiService.post('/login',values);
                  Notification('success',"Login successful!"); //
            } catch (error) {
                  console.log(error);
                  Notification('error',"Login fail!","Please check your password or username!");
                  
            }
      }

      return (    
    <div>
 <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={handleSubmit}
    autoComplete="off"
  >
    <Form.Item<UserForm>
      label="Username"
      name="userName"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<UserForm>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form></div>
  )
}

export default LoginForm