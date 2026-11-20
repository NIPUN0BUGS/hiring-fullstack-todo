import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task title is required.'],
      trim: true,
      minlength: [1, 'A task title cannot be empty.'],
      maxlength: [100, 'A task title cannot be longer than 100 characters.'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'A description cannot be longer than 500 characters.'],
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
