import { toast } from 'react-toastify';

export const checkMimeType = (
  event,
  imgTypes = ['image/png', 'image/jpeg', 'image/jpg']
) => {
  let files = event?.target?.files[0];
  let err = '';
  const types = imgTypes;
  if (types.every((type) => files?.type !== type)) {
    err += files?.type + ' is not a supported format\n';
    toast.error(err, { draggable: true });
  }

  if (err !== '') {
    event.target.value = null;
    return false;
  }
  return true;
};
