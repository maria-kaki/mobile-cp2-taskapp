import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: { initialTab?: 'Home' | 'Tasks' | 'Settings' } | undefined;
};

export type TaskListScreenProps = NativeStackScreenProps<TaskStackParamList, 'TaskList'>;
export type TaskFormScreenProps = NativeStackScreenProps<TaskStackParamList, 'TaskForm'>;
export type TaskDetailScreenProps = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>;

export type HomeTabProps = BottomTabScreenProps<TabParamList, 'Home'>;
export type TasksTabProps = BottomTabScreenProps<TabParamList, 'Tasks'>;
export type SettingsTabProps = BottomTabScreenProps<TabParamList, 'Settings'>;
