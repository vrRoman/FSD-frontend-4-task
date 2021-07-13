import { Value } from '../Model/interfacesAndTypes';

type PresenterOptions = {
  // Будет выполняться при любом передвижении ползунка
  onChange?: (value: Value) => void
}

export default PresenterOptions;
