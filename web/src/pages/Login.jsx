import { useContext, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Stack,
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: 'rgba(0,0,0,0.95)', // menos transparencia
          padding: 5,
          borderRadius: 3,
          border: '2px solid #D7FF00',
          boxShadow: '0 0 25px rgba(215,255,0,0.5)',
          width: '100%',
          maxWidth: 480, // 🔥 más ancho
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 4, color: '#D7FF00', fontWeight: 'bold' }}
        >
          Sign In
        </Typography>

        <TextField
          type="email"
          placeholder="Enter email"
          value={email}
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            input: { color: '#fff' },
            label: { color: '#D7FF00' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#D7FF00' },
              '&:hover fieldset': { borderColor: '#c6f500' },
              '&.Mui-focused fieldset': { borderColor: '#D7FF00' },
            },
          }}
        />

        <TextField
          type="password"
          placeholder="Password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            input: { color: '#fff' },
            label: { color: '#D7FF00' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#D7FF00' },
              '&:hover fieldset': { borderColor: '#c6f500' },
              '&.Mui-focused fieldset': { borderColor: '#D7FF00' },
            },
          }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{
            mb: 2,
            bgcolor: '#D7FF00',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: 2,
            py: 1.5,
            '&:hover': { bgcolor: '#c6f500' },
          }}
        >
          Login
        </Button>

        {/* Extras: Register y Forgot Password */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 2, color: '#D7FF00' }}
        >
          <Button variant="text" sx={{ color: '#D7FF00', fontWeight: 'bold' }}>
            Register
          </Button>
          <Button variant="text" sx={{ color: '#D7FF00', fontWeight: 'bold' }}>
            Forgot Password?
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
