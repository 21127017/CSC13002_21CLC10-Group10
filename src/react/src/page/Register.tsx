import React, {SyntheticEvent, useState} from 'react';
import './Register.css';
import { Button, Form, Input } from 'antd';

const onFinish = (data : any) => {
    //console.log("truoc khi xu ly: ", data)
    const jsonData = JSON.stringify(data)
    //console.log("sau khi xu ly: ", jsonData)
    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: jsonData
    })
    //console.log('Success:', data);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

const Register: React.FC = () => {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    

    // const submitbtw = async (e: SyntheticEvent) => {
    //     e.preventDefault();

    //     const data = {
    //         firs_tname: firstname,
    //         last_name: lastname,
    //         role: role,
    //         email: email,
    //         password: password,
    //         phone: phone
    //     };
        
    //     //const jsonData = JSON.stringify(data)
    //     onFinish(data)
    // }
    return (
        <div className='center1'>
            <h1>REGISTER ACCOUNT</h1>
            <Form 
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >

            <Form.Item label="First name" name="FirstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                <Input onChange={e => setFirstName(e.target.value)} />
            </Form.Item>

            <Form.Item label="Last name" name="LastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                <Input onChange={e => setLastName(e.target.value)} />
            </Form.Item>

            <Form.Item label="Role" name="Role" rules={[{ required: true, message: 'Please input your role!' }]}>
                <Input onChange={e => setRole(e.target.value)} />
            </Form.Item>

            <Form.Item label="Email" name="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input onChange={e => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item label="Phone" name="Phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
                <Input onChange={e => setPhone(e.target.value)} />
            </Form.Item>

            <Form.Item label="Password" name="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input onChange={e => setPassword(e.target.value)} />
            </Form.Item>
        
            <Form.Item label="Confirm" name="confirm" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            </Form>
        </div>
    );
};

export default Register;