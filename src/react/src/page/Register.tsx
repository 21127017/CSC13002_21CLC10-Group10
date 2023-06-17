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

const Register: React.FC = () => (

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
            <Input />
        </Form.Item>

        <Form.Item label="Last name" name="last name" rules={[{ required: true, message: 'Please input your last name!' }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input />
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
    </form>
);

export default Register;