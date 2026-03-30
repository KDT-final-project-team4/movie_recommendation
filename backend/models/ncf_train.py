import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from ncf_network import NCFModel
import os

class MovieDataset(Dataset):
    def __init__(self, df):
        self.users = torch.tensor(df['user_idx'].values, dtype=torch.long)
        self.items = torch.tensor(df['item_idx'].values, dtype=torch.long)
        self.ratings = torch.tensor(df['rating'].values, dtype=torch.float32)

    def __len__(self):
        return len(self.users)

    def __getitem__(self, idx):
        return self.users[idx], self.items[idx], self.ratings[idx]

def train_ncf(processed_dir='data/processed'):
    print("⏳ NCF 모델 학습을 준비합니다. (과적합 방지 로직 적용)")
    df = pd.read_pickle(f'{processed_dir}/ncf_data.pkl')
    
    num_users = df['user_idx'].nunique()
    num_items = df['item_idx'].nunique()
    
    # 1. Train / Validation 데이터 8:2 분리
    train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)
    
    train_dataset = MovieDataset(train_df)
    val_dataset = MovieDataset(val_df)
    
    train_loader = DataLoader(train_dataset, batch_size=512, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=512, shuffle=False)
    
    model = NCFModel(num_users, num_items, embed_size=32)
    criterion = nn.MSELoss()
    
    # 2. L2 정규화(weight_decay) 추가
    optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-5)
    
    epochs = 30 # 최대 에포크 증가
    patience = 3 # 조기 종료 인내심 (3번 연속 개선 없으면 스탑)
    best_val_loss = float('inf')
    epochs_no_improve = 0
    
    print(f"🚀 학습 시작 (Users: {num_users}, Items: {num_items})")
    print(f"   Train Set: {len(train_df)}개 | Val Set: {len(val_df)}개\n")
    
    for epoch in range(epochs):
        # --- 학습 (Training) ---
        model.train()
        total_train_loss = 0
        for users, items, ratings in train_loader:
            optimizer.zero_grad()
            predictions = model(users, items)
            loss = criterion(predictions, ratings)
            loss.backward()
            optimizer.step()
            total_train_loss += loss.item()
            
        avg_train_loss = total_train_loss / len(train_loader)
        
        # --- 검증 (Validation) ---
        model.eval()
        total_val_loss = 0
        with torch.no_grad():
            for users, items, ratings in val_loader:
                predictions = model(users, items)
                loss = criterion(predictions, ratings)
                total_val_loss += loss.item()
                
        avg_val_loss = total_val_loss / len(val_loader)
        
        print(f"Epoch {epoch+1:02d}/{epochs} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f}")
        
        # --- 조기 종료 (Early Stopping) 체크 ---
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            epochs_no_improve = 0
            # 최고 성능일 때만 모델 저장
            torch.save({
                'num_users': num_users,
                'num_items': num_items,
                'model_state_dict': model.state_dict()
            }, f'{processed_dir}/ncf_model.pth')
        else:
            epochs_no_improve += 1
            if epochs_no_improve >= patience:
                print(f"\n🛑 [조기 종료] {epoch+1}번째 에포크에서 학습을 중단합니다. (모델이 암기를 시작함)")
                break

    print("\n✅ NCF 모델 최적화 및 저장 완료! (Best Val Loss 기반)")

if __name__ == "__main__":
    train_ncf()