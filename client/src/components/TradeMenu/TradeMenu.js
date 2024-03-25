import React, { useState, useEffect } from 'react';
import { TradeMenuDiv, Header, TitleLabel, ButtonDiv, Button, MidDiv, SubTitleLabel, Label, HeaderMidDiv, InputText, InputDiv1, InputDiv2, GaugeBarDiv, InputBox, SliderBar, GaugeBarLabelDiv, SliderDiv, AnimatedDiv } from "./TradeMenu.styles";
import InputAdornment from '@mui/material/InputAdornment';
import { useTradedPair } from '../../context/Context';

function TradeMenu() {

    const [activeAction, setActiveAction] = useState("buy");
    const [activeMode, setActiveMode] = useState("limite");
    const [gaugeBarValue, setGaugeBarValue] = useState(0);
    const [availableAmountValue, setAvailableAmountValue] = useState('');
    const [tradedToken, setTradedToken] = useState("USDT");
    const [balancePreviewValue, setBalancePreviewValue] = useState(availableAmountValue);
    const [totalValue, setTotalValue] = useState('');
    const [tokenPrice, setTokenPrice] = useState(65423.45); //faire la requête qui récu^ère le prix
    const [amountToken, setAmountToken] = useState('');
    const [activeBorderColor, setActiveBorderColor] = useState('');


    const { tradedPair } = useTradedPair(); // Récupéré de TradedPairContext
    
    useEffect(() => {
        getUserSolde(tradedToken);
    }, []);



    useEffect(() => {
        if (gaugeBarValue > 0) {
            setTotalValue(availableAmountValue * gaugeBarValue / 100);
        } else {
            setTotalValue('');
        }
    
    }, [gaugeBarValue, availableAmountValue]);
      
    
    useEffect(() => {
        const fetchData = async () => {
            if(activeAction === "buy"){ // Si on passe en mode Buy
                const newTradedToken = tradedPair.split("/")[1];
                setTradedToken(newTradedToken);
                const data = await getUserSolde(newTradedToken);
                if (data.result){
                    const userSolde = data.value;
                    setAvailableAmountValue(userSolde);
                    if(userSolde >= totalValue || totalValue == ''){
                        const newBalancePreviewValue = userSolde - totalValue;
                        setBalancePreviewValue(newBalancePreviewValue);
                    }else{
                        setBalancePreviewValue(0);
                    }
                }
            }else if (activeAction === "sell"){ // Si on passe en mode Sell
                console.log("activeAction : ", activeAction);
                const newTradedToken = tradedPair.split("/")[0];
                setTradedToken(newTradedToken);
                const data = await getUserSolde(newTradedToken);
                if (data.result){
                    const userSolde = data.value;
                    setAvailableAmountValue(userSolde);
                    if(userSolde >= totalValue || totalValue == ''){
                        const newBalancePreviewValue = userSolde - totalValue;
                        setBalancePreviewValue(newBalancePreviewValue);
                    }else{
                        setBalancePreviewValue(0);
                    }
                }
                
            }
        };
    
        fetchData();
    }, [activeAction,tradedPair]);

    const getUserSolde = async (tradedToken) => {
        const userPseudo = localStorage.getItem('pseudo');
        try{
            const response = await fetch('http://localhost:5000/api/get-token-amount', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pseudo: userPseudo, tokenName: tradedToken }),

            });
            const data = await response.json();
            if (response.status === 200) {
                return {result:true, value:data.amount};
            } else{
                console.log('Échec de la connexion');
                return {result:false, value:''};
            }
        } catch (error) {
                console.error('Erreur lors de la connexion', error);
                return {result:false, value:''};
        }
    }

    const handleInputTotalChange = (event) => {
        const newTotalValue = event.target.value;
        changeTotalValue(newTotalValue);
        
    };

    const handleInputPriceChange = (event) => {
        const newPriceValue = event.target.value;
        setTokenPrice(newPriceValue);
    };
    
    const handleInputAmountChange = (event) => {
        const newAmountTokenValue = event.target.value;
        setAmountToken(newAmountTokenValue);
        const newTotalValue = newAmountTokenValue * tokenPrice;
        const newPercentValue = newTotalValue * 100 / availableAmountValue;
        
        if (newPercentValue <= 100) { //Si assez de solde dispo donc total < solde dispo
            setGaugeBarValue(newPercentValue)
            setActiveBorderColor('');
            
        }else{
            setGaugeBarValue(100);
            setActiveBorderColor('amount-field');
            

        }
        setTotalValue(newTotalValue);
        
    };

    const changeTotalValue = (newTotalValue) => {

        if (!newTotalValue || isNaN(newTotalValue)) {
            setGaugeBarValue(0);
            return;
        }

        setTotalValue(newTotalValue);

        const newAmountToken = newTotalValue / tokenPrice;
        setAmountToken(newAmountToken);
        const newBalancePreview = availableAmountValue - newTotalValue;
        if(newTotalValue <= availableAmountValue){
            const newPercentValue = (newTotalValue * 100 / availableAmountValue);
            setBalancePreviewValue(newBalancePreview);
            setGaugeBarValue(parseFloat(newPercentValue));
            setActiveBorderColor('');
        }else{
            setGaugeBarValue(100);
            setBalancePreviewValue(0);
        }

    };
    
    const marks = [
        {
          value: 0,
          label: '0%',
        },
        {
          value: 25,
          label: '25%',
        },
        {
          value: 50,
          label: '50%',
        },
        {
            value: 75,
            label: '75%',
        },
        {
          value: 100,
          label: '100%',
        },
    ];
      
    function valuetext(value) {
        return `${value}%`;
    }

    const handleChangeBar = (event, newBarValue) => {
        const newTotalValue =  availableAmountValue * newBarValue / 100;
        changeTotalValue(newTotalValue);
        if(newBarValue == 0){
            setAmountToken(0);
            setBalancePreviewValue(availableAmountValue);
        }
    };

    const setSlideBarValue = (value) => {
        setGaugeBarValue(value);
    }
    

    return (
        <TradeMenuDiv>
            <Header>
                <AnimatedDiv active={activeAction === "sell"}></AnimatedDiv>
                <TitleLabel id="left-label" active={activeAction === "buy"} onClick={ () => setActiveAction("buy")}>Buy</TitleLabel>
                <TitleLabel id="right-label" active={activeAction === "sell"} onClick={ () => setActiveAction("sell")}>Sell</TitleLabel>
                
            </Header>
            <MidDiv>
                <HeaderMidDiv>
                    <Label id="label-available">Available {availableAmountValue} {tradedToken}</Label>
                    <SubTitleLabel active={activeMode === "limite"} id="label-limite" onClick={ () => setActiveMode("limite")}>Limit</SubTitleLabel>
                    <SubTitleLabel active={activeMode === "market"} id="label-market" onClick={ () => setActiveMode("market")}>Market</SubTitleLabel>
                </HeaderMidDiv>
                <InputDiv1>
                    <InputBox><InputText id="outlined-basic input-price" label={activeMode === "market" ? "Market Price" : "Price"} variant="outlined"
                        readOnly={activeMode === "market"}
                        disabledMode={activeMode === "market"} 
                        active={activeBorderColor === "price-field"}
                        value={activeMode === "market" ? '' : tokenPrice}
                        onChange={handleInputPriceChange}
                        InputProps={{
                        endAdornment: <InputAdornment position="end"><Label>USDT</Label></InputAdornment>,
                        }}/></InputBox>
                    <InputBox><InputText id="outlined-basic" label="Amount" variant="outlined"
                        active={activeBorderColor === "amount-field"}
                        value={amountToken}
                        onChange={handleInputAmountChange}
                        InputProps={{
                        endAdornment: <InputAdornment position="end"><Label>BTC</Label></InputAdornment>,
                        }}/></InputBox>
                </InputDiv1>
                <GaugeBarDiv>
                    <GaugeBarLabelDiv>
                        <Label>{gaugeBarValue.toFixed(2)} %</Label> <Label onClick={ () => setSlideBarValue(100)} id="label-max">Max</Label>
                    </GaugeBarLabelDiv>
                    <SliderDiv>
                        <SliderBar
                            aria-label="Custom marks"
                            value={gaugeBarValue}
                            marks={marks}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            shiftStep={10}
                            step={1}
                            onChange={handleChangeBar}
                            />
                    </SliderDiv>
                </GaugeBarDiv>
                <InputDiv2>
                <InputBox id="input-total"><InputText id="outlined-basic" label="Total" variant="outlined" 
                    active={activeBorderColor === "total-field"}
                    value={totalValue == 0 ? '' : totalValue}
                    onChange={handleInputTotalChange}
                    InputLabelProps={{
                        shrink: gaugeBarValue > 0 ? true : false,
                    }}
                    InputProps={{
                    endAdornment: <InputAdornment position="end"><Label>USDT</Label></InputAdornment>,
                    }}/></InputBox>
                <Label>Balance Preview : {balancePreviewValue} {tradedToken}</Label>
                </InputDiv2>
            </MidDiv>
            <ButtonDiv>
                <Button id="btn-buy" active={activeAction === "buy"}>Buy</Button>
                <Button id="btn-sell" active={activeAction === "sell"}>Sell</Button>
            </ButtonDiv>
        </TradeMenuDiv>
    );
}

export default TradeMenu;