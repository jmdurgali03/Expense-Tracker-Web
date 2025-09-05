import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';

import { validateEmail } from '../../utils/helper';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

import { UserContext } from '../../context/userContext';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        let profileImageUrl = "";

        if (!fullName) {
            setError("Please enter your full name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        setError(null);

        // sign up api call
        try {

            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGITER, {
                fullName,
                email,
                password,
                profileImageUrl
            })

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user);
                navigate('/dashboard');
            }
        }

        catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("Something went wrong");
            }
        }
    }

    return (
        <AuthLayout>
            <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>
                    Create an Account
                </h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Joins us today by entering your details below.
                </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                        />
                        <Input
                            label="Email Address"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />
                        <div className='col-span-2'>
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                        </div>
                    </div>

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button
                        type='submit'
                        className='btn-primary'
                    >
                        SIGN UP
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{' '}
                        <Link to={'/login'} className='font-medium text-primary underline'>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp