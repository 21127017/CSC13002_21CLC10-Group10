import React, {SyntheticEvent, useState} from 'react';
import { Navigate } from "react-router-dom";
import './Register.css';
import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

const Register: React.FC = () => {

    const [first_name, setFirst_Name] = useState('');
    const [last_name, setLast_Name] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const submitbtw = async (e: SyntheticEvent) => {
        e.preventDefault();

        await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "first_name" : first_name,
                "last_name" : last_name,
                "role" : role,
                "email" : email,
                "password" : password,
                "phone" : phone
            })
        });
    }
    return (
        <form className='center1'>
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

            <Form.Item label="First name" name="first name" rules={[{ required: true, message: 'Please input your first name!' }]}>
                <Input onChange={e => setFirst_Name(e.target.value)} />
            </Form.Item>

            <Form.Item label="Last name" name="last name" rules={[{ required: true, message: 'Please input your last name!' }]}>
                <Input onChange={e => setLast_Name(e.target.value)} />
            </Form.Item>

            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please input your role!' }]}>
                <Input onChange={e => setRole(e.target.value)} />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input onChange={e => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
                <Input onChange={e => setPhone(e.target.value)} />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input onChange={e => setPassword(e.target.value)} />
            </Form.Item>
        
            <Form.Item label="Confirm" name="confirm" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" onClick={() => submitbtw}>
                    Submit
                </Button>
            </Form.Item>
            </Form>
        </form>
    );
};

export default Register;