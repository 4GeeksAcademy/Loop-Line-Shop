import { useContext, useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(UserContext);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('👉 Registrando usuario:', formData);
    try {
      await register(formData.nombre, formData.email, formData.password);
    } catch (error) {
      console.log('la puta madre', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 400,
        margin: 'auto',
        mt: 6,
        borderRadius: 3,
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ color: '#D7FF00' }}
      >
        Registrarse
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          margin="normal"
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
          fullWidth
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
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
          fullWidth
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
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
          fullWidth
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#D7FF00',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#c0e600' },
          }}
        >
          Registrarme
        </Button>
      </form>

      {/* Botón que vuelve al login */}
      <Button
        variant="text"
        fullWidth
        onClick={() => navigate('/login')}
        sx={{ mt: 2, color: '#D7FF00', fontWeight: 'bold' }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Paper>
  );
}
