import React, { useState } from 'react'; 
import { loginUser, registerUser, loginWithGoogle } from '../services/auth';

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      const { user, error } = await registerUser(email, password, name);
      if (user) {
        setRegistrationSuccess(true); 
        setTimeout(() => {
          setRegistrationSuccess(false); 
          setIsAuthenticated(true); 
        }, 2000);
      }
      if (error) {
        setError(error);
      }
    } else {
      const { user, error } = await loginUser(email, password);
      if (user) {
        setIsAuthenticated(true);
      }
      if (error) {
        setError(error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { user, error } = await loginWithGoogle();
    if (user) {
      setIsAuthenticated(true);
    }
    if (error) {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-100">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#F5F5DC] rounded-lg shadow-lg">
          <div>
            <img
              src="\Designer-removebg-preview.png"
              alt="Mexican Restaurant Logo"
              className="mx-auto h-48 w-auto"
            />
            <h2 className="mt-6 text-center text-3xl font-bold text-[#8B4513]">
              {isRegistering ? 'Regístrate' : 'Iniciar Sesión'}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="bg-[#FFC0CB] border border-[#FF69B4] text-[#FF0000] px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">¡Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            {registrationSuccess && (
              <div
                className="bg-[#DFF2BF] border border-[#4F8A10] text-[#4F8A10] px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">¡Éxito!</strong>
                <span className="block sm:inline"> Usuario creado con éxito</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              {isRegistering && (
                <div className="py-6">
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DEB887] text-[#8B4513] rounded-t-md focus:outline-none focus:ring-[#D2691E] focus:border-[#D2691E] focus:z-10 sm:text-sm"
                    placeholder="Nombre"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="py-6">
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DEB887] text-[#8B4513] rounded-t-md focus:outline-none focus:ring-[#D2691E] focus:border-[#D2691E] focus:z-10 sm:text-sm"
                  placeholder="Correo Electrónico"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="py-6">
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DEB887] text-[#8B4513] rounded-t-md focus:outline-none focus:ring-[#D2691E] focus:border-[#D2691E] focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isRegistering && (
                <div className="py-6">
                  <input
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DEB887] text-[#8B4513] rounded-t-md focus:outline-none focus:ring-[#D2691E] focus:border-[#D2691E] focus:z-10 sm:text-sm"
                    placeholder="Confirmar Contraseña"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              <div className="py-6">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B4513] hover:bg-[#CD853F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2691E]"
                >
                  {isRegistering ? 'Regístrate' : 'Iniciar Sesión'}
                </button>
              </div>
            </div>
          </form>
          <div className="py-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 px-4 border border-[#DEB887] text-sm font-medium rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2691E]"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="Google Logo"
                className="h-5 w-5 mr-2"
              />
              Entrar con Google
            </button>
          </div>
          <div className="text-sm text-center">
            {isRegistering ? (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setError(null);
                  }}
                  className="font-medium text-[#8B4513] hover:text-[#CD853F]"
                >
                  Inicia Sesión
                </button>
              </p>
            ) : (
              <p>
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setError(null);
                  }}
                  className="font-medium text-[#8B4513] hover:text-[#CD853F]"
                >
                  Regístrate
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;