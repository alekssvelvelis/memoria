import React, { useState, useEffect} from 'react';
import ProfileChangePassword from './ProfileChangePassword';
const ProfileUserForm = ({ onUserDataChange, defaultUsername, email }) => {

    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        profileUsername: '',
        profileEmail: '',
    });

    useEffect(() => {
        setFormData({profileUsername: defaultUsername, profileEmail: email})
      }, [defaultUsername]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        console.log(formData);
    };
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost/api/getUserData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isLoggedIn}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userData = data && data.user ? data.user : null
                setUserData(userData);
                setFormData({
                    profileUsername: userData.username || defaultUsername,
                    profileEmail: userData.email || '',
                });
                onUserDataChange(userData, userData.username);
            } else {
                const errorData = await response.json();
                console.error('Error fetching user info:', errorData);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [isLoggedIn]);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const togglePasswordModal = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        const usernameToClear = formData.profileUsername;
        const emailToClear = formData.profileEmail;
        console.log(emailToClear);
        console.log(usernameToClear);
        if (!emailToClear) {
            validationErrors.profileEmail = 'E-mail is required';
        }

        if (!usernameToClear) {
            validationErrors.profileUsername = 'Username is required';
        } else if (usernameToClear.match(/^[^a-zA-Z0-9]+$/)){
            validationErrors.profileUsername = 'Username cannot contain symbols';
        } else if(usernameToClear.trim().length < 3){
            validationErrors.profileUsername = 'Minimum length is 3 symbols';
        } else if(usernameToClear.trim().length > 15){
            validationErrors.profileUsername = 'Maximum length is 15 symbols';
        }
        
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            try{
                const response = await fetch('http://localhost/api/updateUserData', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                    body: JSON.stringify(formData),
                });
                const responseData = await response.json();
                if (!response.ok) {
                    setErrors(responseData.errors);
                    setSuccess('');
                }else{
                    setSuccess(responseData.message);
                    const timeout = setTimeout(() => {
                        setSuccess(null);
                    }, 3000);
                    onUserDataChange({ ...userData, username: formData.profileUsername }, formData.profileUsername);
                }
            } catch (error) {
                console.error('Error:', error);
            } 
        }
        try {
            let imageForm = new FormData();
            imageForm.append('profilePicture', selectedFile);
            const imageResponse = await fetch('http://localhost/api/updateUserImage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${isLoggedIn}`
                },
                body: imageForm,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const [opacity, setOpacity] = useState(1);
    useEffect(() => {
        let intervalId;
        if (success) {
          intervalId = setInterval(() => {
            setOpacity((prevOpacity) => Math.max(0, prevOpacity - 0.05));
          }, 100);
        }
        if(opacity === 0){
            setSuccess(null);
        }
    
        return () => {
          clearInterval(intervalId);
          setOpacity(1);
        };
      }, [success]);

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        const newSelectedFile = e.target.files[0];
        setSelectedFile(e.target.files[0]);
    };

    const hasPassword = userData.password_hash;
    const handlePasswordChangeSuccess = async () => {
        await fetchUserInfo();
        setIsPasswordModalOpen(false); 
    };
    return(
        <>
            <form className={`w-[85%] min-h-[600px] transition-all ease-in-out duration-500 m-2 rounded-xl flex flex-col items-center bg-[rgb(26,26,26,0.9)]`} onSubmit={handleSubmitForm}>
                <div className='w-full h-[40%] flex justify-center items-center m-2 relative'>
                    <label className='cursor-pointer'>
                        <img
                            className='m-2 rounded-[100%] h-[240px] w-[240px] max-[320px]:w-[220px] max-[320px]:m-1 object-cover shadow-xl shadow-black/40 hover:scale-105 transition-transform duration-150 cursor-pointer'
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (userData?.image_path)}
                            alt='Profile Picture'
                        />
                        <input
                            type='file'
                            className='absolute -top-1 m-2 rounded-[100%] h-[240px] w-[240px] max-[425px]:w-[200px] opacity-0 cursor-pointer'
                            id='profilePicture'
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                <div className='w-[90%]'>
                    <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='profileUsername'>Username:</label>
                    <input value={formData.profileUsername} onChange={handleChange} className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='text' id='profileUsername' name='profileUsername'/>
                    {errors.profileUsername && <p className="text-red-500 ml-3 my-2 text-lg">{errors.profileUsername}</p>}
                </div>
                <div className='w-[90%]'>
                    <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='profileEmail'>E-mail:</label>
                    <input value={formData.profileEmail} onChange={handleChange} className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='text' id='profileEmail' name='profileEmail'/>
                    {errors.profileEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.profileEmail}</p>}
                </div>
                <input className='mt-4 w-[60%] my-2 h-10 bg-[rgb(33,36,37)] hover:bg-[rgb(39,42,43)] hover:border-neutral-200 focus:border-2 border-neutral-600 border text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Save' />
                    <p className={`min-h-[28px] max-[425px]:min-h-[48px] text-center text-green-500 ml-3 my-2 text-lg`} style={{ opacity }}>
                        {success}
                    </p>
                <div className='w-full text-center justify-center items-center flex'>
                    <p
                        onClick={togglePasswordModal}
                        className='mr-1 max-[426px]:mt-2 w-fit my-2 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide'
                    >
                        Want to change your password?
                    </p>
                </div>
            </form>
            {isPasswordModalOpen && (
                    <ProfileChangePassword onClose={closePasswordModal} hasPassword={hasPassword} onPasswordChange={handlePasswordChangeSuccess}/>
            )}
        </>
    );
}

export default ProfileUserForm;