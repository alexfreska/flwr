<?php 
/*
####################################################################
Functions generates base 62 number to be used as the url address
for a chart. The function takes a number in specified base, converts 
it to base 10, and then to base 62.
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
In the case of Flowur, the function is at least for now only ever
used from 10 to 62, so the conversion to base 10 is skipped but 
included incase it is necessary in future naming schemes.
####################################################################
*/

function baseConverter($convValue, $originalBase, $newBase)
{

//variable declarations
	//digits used in base 62 conversions
	$digitList = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	//variable used in the base 10 middle conversion
	$decimal = '0';
	//used in final base conversion
	$level = 0;
	//variable holding resulting base 62 number
	$result = '';

//following two errors would never occur because user input is 
//never used for these fields, and bases are always 10 and 62.

    if (min($originalBase, $newBase) < 2)
	//if base does not make sense
    {
        trigger_error('Bad Format min: 2', E_USER_ERROR);
    }

    if (max($originalBase, $newBase) > strlen($digitList))
	//if one of the bases is greater than digits available
    {
        trigger_error('Bad Format max: ' . strlen($digitList), E_USER_ERROR);
    }
	
	//remove specified chars from both sides of string
    $convValue = trim(strval($convValue), "\r\n\t +");
	
	//
    $sign = '-' === $convValue{0} ? '-' : '';
	
	//trim left side
    $convValue = ltrim($convValue, "-0");
	
	//len is the length of the value string after all the trims
    $len = strlen($convValue);
	
	//for the length len
    for ($i = 0; $i < $len; $i++)
    {
		//value starts at the last pos in convValue
        $value = strpos($digitList, $convValue{$len - 1 - $i});

        if (FALSE === $value)
		//if it does not exist in the digitList -> problem
        {
                trigger_error('Bad Char in input 1', E_USER_ERROR);
        }

        if ($value >= $originalBase)
		//also means ->problem
        {
                trigger_error('Bad Char in input 2', E_USER_ERROR);
        }
		
		//convert digit to base 10 and add the base 10 value
        $decimal = bcadd($decimal, bcmul(bcpow($originalBase, $i), $value));
    }

    if (10 == $newBase)
	//if 10 is the new base we are done
    {
        return $sign . $decimal;
    }
	//while newBase to the level is less than decimal value, increment level;
    while (1 !== bccomp(bcpow($newBase, $level++), $decimal));
	
	//create result
    for ($i = $level - 2; $i >= 0; $i--)
    {
        $factor = bcpow($newBase, $i);
        $numb = bcdiv($decimal, $factor, 0);
        $decimal = bcmod($decimal, $factor);
        $result .= $digitList{$numb};
    }

    $result = empty($result) ? '0' : $result;

    return $sign . $result;
}


?>
