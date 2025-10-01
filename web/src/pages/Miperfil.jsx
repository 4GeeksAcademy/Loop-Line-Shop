import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Avatar,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

export const Miperfil = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    codigoPostal: '',
    region: '',
    foto: null,
    previewFoto: '',
  });

  const [loading, setLoading] = useState(false);

  const regiones = [
    { value: 'norte', label: 'Norte' },
    { value: 'centro', label: 'Centro' },
    { value: 'sur', label: 'Sur' },
  ];

  useEffect(() => {
    return () => {
      if (formData.previewFoto) {
        URL.revokeObjectURL(formData.previewFoto);
      }
    };
  }, [formData.previewFoto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
        previewFoto: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ No hay sesión iniciada. Por favor, inicia sesión.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('email', formData.email);
      data.append('direccion', formData.direccion);
      data.append('codigoPostal', formData.codigoPostal);
      data.append('region', formData.region);
      if (formData.foto) data.append('foto', formData.foto);

      const response = await fetch(
        'https://fluffy-lamp-r4w5pp5496p6h5r4j-5000.app.github.dev/api/perfil',
        {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Perfil actualizado:', result);
        alert('✅ Perfil actualizado correctamente');
      } else {
        console.error('Error al actualizar:', result);
        alert(
          `❌ Error al actualizar perfil: ${result.message || 'Revise los datos'}`
        );
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('⚠️ Error en la conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        margin: 'auto',
        borderRadius: 3,
        backgroundColor: '#000', // ✅ Fondo negro
        color: '#fff', // Texto blanco
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ color: '#D7FF00' }}
      >
        Editar perfil
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/* Foto de perfil */}
          <Grid2 xs={12} sx={{ textAlign: 'center' }}>
            <Avatar
              src={formData.previewFoto}
              sx={{ width: 100, height: 100, margin: 'auto' }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{
                mt: 1,
                borderRadius: 2,
                backgroundColor: '#D7FF00',
                color: '#000',
                '&:hover': { backgroundColor: '#c0e600' },
              }}
            >
              Cambiar Foto de Perfil
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Grid2>

          {/* Nombre */}
          <Grid2 xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
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
          </Grid2>

          {/* Email */}
          <Grid2 xs={12}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
          </Grid2>

          {/* Dirección */}
          <Grid2 xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
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
          </Grid2>

          {/* Código Postal */}
          <Grid2 xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código Postal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
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
          </Grid2>

          {/* Región */}
          <Grid2 xs={12}>
            <TextField
              select
              fullWidth
              label="Región"
              name="region"
              value={formData.region}
              onChange={handleChange}
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
            >
              {regiones.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          {/* Botón Guardar */}
          <Grid2 xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                backgroundColor: '#D7FF00',
                color: '#000',
                '&:hover': { backgroundColor: '#c0e600' },
              }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Paper>
  );
};
