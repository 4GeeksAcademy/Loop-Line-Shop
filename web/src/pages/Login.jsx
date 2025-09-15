import { useContext, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  FormGroup,
  Typography,
} from '@mui/material';
import { UserContext } from '../context/User';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, users } = useContext(UserContext);
  const handleSubmit = () => {
    setError('');

    // Validar email único desde el contexto
    const emailExists = users?.some((user) => user.email === email);
    if (emailExists) {
      setError('El email ya está registrado, prueba con otro.');
      return;
    }

    // Validar longitud mínima de contraseña (8 caracteres)
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Si pasa validaciones, ejecuta login
    login(email, password);
  };

  return (
    <Container>
      <FormGroup className="mb-3" controlId="formBasicEmail">
        <TextField
          type="email"
          placeholder="Enter email"
          value={email}
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup className="mb-3" controlId="formBasicPassword">
        <TextField
          type="password"
          placeholder="Password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="primary"
        sx={{
          background: 'linear-gradient(45deg, #416dffff, #2baeffff)',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          boxShadow: '0 4px 12px rgba(255,65,108,0.5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff4b2b, #ff416c)',
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Container>
  );
};
