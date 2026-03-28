import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import os
from ncf_network import NCFModel

def train_and_save_model(data_path='../data/processed/ncf_data.pkl', save_path='../data/processed/ncf_weights.pth'):
    # 1. 전처리된 데이터 로드
    ncf_data = pd.read_pickle(data_path)
    
    num_users = ncf_data['user_idx'].nunique()
    num_items = ncf_data['item_idx'].nunique()
    
    # 2. 모델, 손실함수, 최적화 기법 초기화
    model = NCFModel(num_users, num_items)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    # 3. 데이터 텐서 변환
    users = torch.tensor(ncf_data['user_idx'].values, dtype=torch.long)
    items = torch.tensor(ncf_data['item_idx'].values, dtype=torch.long)
    ratings = torch.tensor(ncf_data['rating'].values, dtype=torch.float32).view(-1, 1)
    
    # 4. 모델 학습 (CPU 환경을 고려해 Epoch은 5로 제한)
    epochs = 5
    print("🚀 NCF 모델 학습 시작...")
    for epoch in range(epochs):
        optimizer.zero_grad()
        predictions = model(users, items)
        loss = criterion(predictions, ratings)
        loss.backward()
        optimizer.step()
        
        print(f"Epoch {epoch+1}/{epochs} | Loss: {loss.item():.4f}")
        
    # 5. 학습된 가중치(State Dict) 저장
    torch.save(model.state_dict(), save_path)
    print(f"✅ 학습 완료! 가중치가 '{save_path}'에 저장되었습니다.")

if __name__ == "__main__":
    train_and_save_model()