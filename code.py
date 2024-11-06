import tensorflow as tf
import tensorflow
from tensorflow.keras import layers
from tensorflow.keras.optimizers.legacy import Adam
from tensorflow.keras.layers import Input, Lambda, Dense, Flatten, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator,load_img
from tensorflow.keras.models import Sequential
import numpy as np
import glob
import matplotlib.pyplot as plt
from keras.models import load_model
import ntpath
from sklearn.metrics import confusion_matrix
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
IMAGE_SIZE = [224, 224]

train_path = r"C:\Users\sebas\Desktop\disease\train"
valid_path = r"C:\Users\sebas\Desktop\disease\valid"
inception = InceptionV3(input_shape=IMAGE_SIZE + [3], weights='imagenet', include_top=False)
for layer in inception.layers:
    layer.trainable = False
folders = glob.glob(r"C:\Users\sebas\Desktop\disease\train")
print(len(folders))
model = Sequential()

# Add the Inception V3 base model

model.add(inception)

# Add a Flatten layer to convert the 3D output to 1D
model.add(Flatten())

# Add Dense layers for classification
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(1, activation='sigmoid'))

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])


model.summary()

model.compile(
  loss='binary_crossentropy',
  optimizer='adam',
  metrics=['accuracy']
)

from tensorflow.keras.preprocessing.image import ImageDataGenerator

train_datagen = ImageDataGenerator(rescale = 1./255,
                                   zoom_range = 0.2,
                                   horizontal_flip = True)

test_datagen = ImageDataGenerator(rescale = 1./255)


training_set = train_datagen.flow_from_directory(r"C:\Users\sebas\Desktop\disease\train",
                                                 target_size = (224, 224),
                                                 batch_size = 512,
                                                 class_mode = 'binary')

test_set = test_datagen.flow_from_directory(r"C:\Users\sebas\Desktop\disease\test",
                                            target_size = (224, 224),
                                            batch_size = 512,
                                            class_mode = 'binary')

from keras.callbacks import ModelCheckpoint, EarlyStopping
import pickle



filepath = r"C:\Users\sebas\Desktop\disease\model_fit_{epoch:02d}-{val_accuracy:.2f}.h5"
checkpoint1 = ModelCheckpoint(filepath, monitor='val_accuracy', verbose=1, save_best_only=True, mode='max')
early = EarlyStopping(monitor="acc", mode="max", patience=15)

callbacks_list = [checkpoint1, early] #early


history = model.fit_generator(
  training_set,
  validation_data=test_set,
  epochs=25,
  steps_per_epoch=len(training_set),
  validation_steps=len(test_set),
  callbacks=callbacks_list
)

import matplotlib.pyplot as plt
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(len(acc))

plt.plot(epochs, acc, 'bo', label='Training accuracy')
plt.plot(epochs, val_acc, 'b', label='Validation accuracy')
plt.title('Training and validation accuracy')
plt.legend()

plt.figure()

plt.plot(epochs, loss, 'bo', label='Training Loss')
plt.plot(epochs, val_loss, 'b', label='Validation Loss')
plt.title('Training and validation loss')
plt.legend()

plt.show()
