import React, { useState, useEffect } from 'react';
import { TradeMenuDiv, Header, TitleLabel, ButtonDiv, Button, MidDiv, SubTitleLabel, Label, HeaderMidDiv, InputText, InputDiv1, InputDiv2, GaugeBarDiv, InputBox, SliderBar, GaugeBarLabelDiv, SliderDiv, AnimatedDiv } from "./TradeMenu.styles";
import InputAdornment from '@mui/material/InputAdornment';
import { useTradedPair } from '../../context/Context';

function TradeMenu() {

    const [activeAction, setActiveAction] = useState("buy");
    const [activeMode, setActiveMode] = useState("limite");
    const [gaugeBarValue, setGaugeBarValue] = useState(0);
    const [availableAmountValue, setAvailableAmountValue] = useState(0);
    const [tradedToken, setTradedToken] = useState("USDT");
    const [balancePreviewValue, setBalancePreviewValue] = useState(availableAmountValue);
    const [amountSellToken, setAmountSellToken] = useState('');
    const [tokenPrice, setTokenPrice] = useState(65423.45); //faire la requête qui récu^ère le prix
    const [amountBuyToken, setAmountBuyToken] = useState('');
    const [isTotalFocused, setIsTotalFocused] = useState(false);




    const { tradedPair } = useTradedPair(); // Récupéré de TradedPairContext


    useEffect(() => {
        const fetchData = async () => {
            if(activeAction === "buy"){ // Si on passe en mode Buy
                const newTradedToken = tradedPair.split("/")[1];
                setTradedToken(newTradedToken);
                const data = await getUserSolde(newTradedToken);
                if (data.result){
                    const userSolde = data.value;
                    setAvailableAmountValue(userSolde);
                    if(userSolde >= amountSellToken || amountSellToken == ''){
                        const newBalancePreviewValue = userSolde - amountSellToken;
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
                    if(userSolde >= amountSellToken || amountSellToken == ''){
                        const newBalancePreviewValue = userSolde - amountSellToken;
                        setBalancePreviewValue(newBalancePreviewValue);
                    }else{
                        setBalancePreviewValue(0);
                    }
                }
                
            }
        };
    
        fetchData();
    }, [activeAction,tradedPair]);

    useEffect(() => {
        setAmountBuyToken('');
        setAmountSellToken('');
        setGaugeBarValue(0);
        setBalancePreviewValue(availableAmountValue);
        //fonction qui récupère la valeur du token
        setTokenPrice(65423.45);
        
    }, [activeAction]);

    const getUserSolde = async (tradedToken) => {
        const userPseudo = localStorage.getItem('pseudo');
        console.log("tradedToken : ", tradedToken);
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



    //Changement du prix du token (pour le mode limite)
    const handleInputPriceChange = (event) => {
        const newTokenPrice = event.target.value;
        setTokenPrice(newTokenPrice); // changement du prix affiché
        //Si action d'achat & limite
        if(activeAction == "buy" && activeMode == "limite"){
            const newAmountSellToken = newTokenPrice * amountBuyToken; //Recalcule du montant en token
            setAmountSellToken(newAmountSellToken) // changement du montant en token affiché

        }
        //Si action de vente & limite
        else if(activeAction == "sell" && activeMode == "limite"){
            const newAmountBuyToken = amountSellToken * newTokenPrice;
            setAmountBuyToken(newAmountBuyToken);
        }
    };
    

    const handleInputBuyTokenAmountChange = (event) => {
        let newBuyTokenAmount = "";
        //Si action d'achat & limite
        if(activeAction == "buy" && activeMode == "limite"){
            newBuyTokenAmount = event.target.value;
            const newSellTokenAmount = newBuyTokenAmount * tokenPrice ;
            
            //Si assez d'argent à dépenser
            if(newSellTokenAmount <= availableAmountValue){
                const newBalancePreviewValue = availableAmountValue - newSellTokenAmount;
                setAmountBuyToken(newBuyTokenAmount); //Changement montant token à l'achat
                setAmountSellToken(newSellTokenAmount); //Changement montant token à la vente
                const gaugeBarValue = newSellTokenAmount * 100 / availableAmountValue; // Recalcule de la valeur de la gauge
                setGaugeBarValue(gaugeBarValue);
                setBalancePreviewValue(newBalancePreviewValue); //Changement de l'estimation de la balance
            }
            //Si pas assez de fond dispo on change la valeur de vente à l'argent disponnible de l'utilisateur
            else{
                newBuyTokenAmount = availableAmountValue / tokenPrice;
                setAmountBuyToken(newBuyTokenAmount); //Changement montant token à l'achat (avec valeur max possible en fonction des fonds dispo)
                setAmountSellToken(availableAmountValue); //Changement montant token à la vente (Avec l'ensemble des fonds dispo)
                setGaugeBarValue(100); //Changement de la valeur de la gauge avec la valeur max
                setBalancePreviewValue(0); //Changement de l'estimation à 0 car 100% des fonds utiliser
            }
        }
        //Si action de vente & limite
        else if (activeAction == "sell" && activeMode == "limite"){
            newBuyTokenAmount = event.target.value;
            const newSellTokenAmount = newBuyTokenAmount / tokenPrice ;
            if(newSellTokenAmount <= availableAmountValue){
                const newBalancePreviewValue = availableAmountValue - newSellTokenAmount;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(newSellTokenAmount);
                const gaugeBarValue = newSellTokenAmount * 100 / availableAmountValue;
                setGaugeBarValue(gaugeBarValue);
                setBalancePreviewValue(newBalancePreviewValue);
            }
            //Si pas assez de fond dispo on change la valeur de vente à l'argent disponnible de l'utilisateur
            else{
                newBuyTokenAmount = availableAmountValue * tokenPrice;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(availableAmountValue);
                setGaugeBarValue(100);
                setBalancePreviewValue(0);
            }
            
        }
    };

    const handleInputSellTokenAmountChange = (event) => {
        let newSellTokenAmount = "";
        if (activeAction == "buy" && activeMode == "limite"){
            newSellTokenAmount = event.target.value;
            const newBuyTokenAmount = newSellTokenAmount / tokenPrice ;
            if(newSellTokenAmount <= availableAmountValue){
                const newBalancePreviewValue = availableAmountValue - newSellTokenAmount;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(newSellTokenAmount);
                const gaugeBarValue = newSellTokenAmount * 100 / availableAmountValue;
                setGaugeBarValue(gaugeBarValue);
                setBalancePreviewValue(newBalancePreviewValue);
            }
            //Si pas assez de fond dispo on change la valeur de vente à l'argent disponnible de l'utilisateur
            else{
                newSellTokenAmount = availableAmountValue;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(newSellTokenAmount);
                setGaugeBarValue(100);
                setBalancePreviewValue(0);
            }
        }
        else if(activeAction == "sell" && activeMode == "limite"){
            newSellTokenAmount = event.target.value;
            let newBuyTokenAmount = newSellTokenAmount * tokenPrice ;
            if(newSellTokenAmount <= availableAmountValue){
                const newBalancePreviewValue = availableAmountValue - newSellTokenAmount;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(newSellTokenAmount);
                const gaugeBarValue = newSellTokenAmount * 100 / availableAmountValue;
                setGaugeBarValue(gaugeBarValue);
                setBalancePreviewValue(newBalancePreviewValue);
            }else{
                newSellTokenAmount = availableAmountValue;
                newBuyTokenAmount = availableAmountValue * tokenPrice;
                setAmountBuyToken(newBuyTokenAmount);
                setAmountSellToken(newSellTokenAmount);
                setGaugeBarValue(100);
                setBalancePreviewValue(0);
            }
        }
    };

    const handleChangeBar = (event, newBarValue) => {
        newBarValue = event.target.value;
        if (activeAction == "buy" && activeMode == "limite"){

            const newAmountBuyToken = ((availableAmountValue / tokenPrice) * newBarValue) / 100;
            setAmountBuyToken(newAmountBuyToken);

            const newAmountSellToken = availableAmountValue * newBarValue / 100;
            setAmountSellToken(newAmountSellToken);

            setGaugeBarValue(newBarValue);

            const newBalancePreviewValue = availableAmountValue - amountSellToken;
            setBalancePreviewValue(newBalancePreviewValue);
        }
        else if (activeAction == "sell" && activeMode == "limite"){
            const newAmountBuyToken = availableAmountValue * tokenPrice * newBarValue / 100;
            setAmountBuyToken(newAmountBuyToken);

            const newAmountSellToken = availableAmountValue * newBarValue / 100;
            setAmountSellToken(newAmountSellToken);

            setGaugeBarValue(newBarValue);

            const newBalancePreviewValue = availableAmountValue - amountSellToken;
            setBalancePreviewValue(newBalancePreviewValue);
        }
    };
    
    const handleInputMax = () => {
        setGaugeBarValue(100);
        if (activeAction == "buy" && activeMode == "limite"){
            const newAmountBuyToken = availableAmountValue / tokenPrice ;
            setAmountBuyToken(newAmountBuyToken);

            const newAmountSellToken = availableAmountValue;
            setAmountSellToken(newAmountSellToken);
        }
        else if (activeAction == "sell" && activeMode == "limite"){
            const newAmountBuyToken = availableAmountValue * tokenPrice ;
            setAmountBuyToken(newAmountBuyToken);

            const newAmountSellToken = availableAmountValue;
            setAmountSellToken(newAmountSellToken);
        }

    }
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



    const buy = async () => {
        if(amountSellToken <= availableAmountValue){ //Si le solde est suffisant pour achat
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch('http://localhost:5000/api/buy', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        amountBuyToken: amountBuyToken, 
                        amountSellToken: amountSellToken,
                        priceBuyToken: tokenPrice,
                        tradedPair: tradedPair,  
                        userPseudo: userPseudo,
                        action:activeAction,
                        mode: activeMode

                    }),
    
                });
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Achat Réussi");
                } else{
                    console.log("Échec de l'achat");
                }
            } catch (error) {
                    console.error('Erreur lors de la connexion', error);
            }
        }
    }

    const sell = async () => {
        if(amountSellToken <= availableAmountValue){
            try{
                const userPseudo = localStorage.getItem('pseudo');
                const response = await fetch('http://localhost:5000/api/buy', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        amountBuyToken: amountBuyToken, 
                        amountSellToken: amountSellToken,
                        priceBuyToken: tokenPrice,
                        tradedPair: tradedPair,  
                        userPseudo: userPseudo,
                        action:activeAction,
                        mode: activeMode

                    }),
    
                });
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Achat Réussi");
                } else{
                    console.log("Échec de l'achat");
                }
            } catch (error) {
                    console.error('Erreur lors de la connexion', error);
            }
        }
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
                        value={activeMode === "market" ? '' : tokenPrice}
                        onChange={handleInputPriceChange}
                        inputProps={{
                            endAdornment: <InputAdornment position="end"><Label>USDT</Label></InputAdornment>,
                          }}/></InputBox>
                    <InputBox><InputText id="outlined-basic" label="Amount" variant="outlined"
                        value={activeAction === "buy" ? amountBuyToken : amountSellToken}
                        onChange={activeAction === "buy" ? handleInputBuyTokenAmountChange : handleInputSellTokenAmountChange}
                        inputProps={{
                            endAdornment: <InputAdornment position="end"><Label>BTC</Label></InputAdornment>,
                          }}/></InputBox>
                </InputDiv1>
                <GaugeBarDiv>
                    <GaugeBarLabelDiv>
                        <Label>{gaugeBarValue.toFixed(2)} %</Label> <Label onClick={ () => handleInputMax()} id="label-max">Max</Label>
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
                    value={activeAction === "buy" ? amountSellToken : amountBuyToken}
                    onChange={activeAction === "buy" ? handleInputSellTokenAmountChange : handleInputBuyTokenAmountChange}
                    InputLabelProps={{
                        shrink: gaugeBarValue > 0 || isTotalFocused,
                    }}
                    onFocus={() => setIsTotalFocused(true)}
                    onBlur={() => setIsTotalFocused(false)}
                    inputProps={{
                        endAdornment: <InputAdornment position="end"><Label>USDT</Label></InputAdornment>,
                      }}/></InputBox>
                <Label>Balance Preview : {balancePreviewValue} {tradedToken}</Label>
                </InputDiv2>
            </MidDiv>
            <ButtonDiv>
                <Button id="btn-buy" active={activeAction === "buy"} onClick={ ()=> buy()}>Buy</Button>
                <Button id="btn-sell" active={activeAction === "sell"} onClick={ ()=> sell()}>Sell</Button>
            </ButtonDiv>
        </TradeMenuDiv>
    );
}

export default TradeMenu;